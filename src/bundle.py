import os, base64


SRC_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_DIR = os.path.join(os.path.dirname(SRC_DIR), "ffmpeg.wasm")
OUT_DIR = os.path.join(os.path.dirname(SRC_DIR), "out")

FFMPEG_CORE_WASM = os.path.join(
	FFMPEG_DIR,
	"packages", "core", "dist", "esm", "ffmpeg-core.wasm"
)
FFMPEG_CORE_JS = os.path.join(
	FFMPEG_DIR,
	"packages", "core", "dist", "esm", "ffmpeg-core.js"
)
TEMPLATE = os.path.join(
	SRC_DIR, "_template.js"
)

def preProcess(js, corejsB64, corewasmB64):
	while -1 != (loc:=js.find("\n#!")):
		content = ""
		next_nl = js[loc+3:].find("\n")
		assert next_nl != -1, "All commands must be done with a newline following!"
		after = js[loc+3 + next_nl: ]


		if js[loc+3:].startswith("include"):
			f = open(js[loc:].split('"')[1], "r")
			content = f.read()
			f.close()
		elif js[loc+3:].startswith("b64_include"):
			after_command = js[loc+len("\n#!b64_include "): ].split("\n")[0]
			name, file = after_command.split(", ")
			content = f"const {name} = '"

			f = open(file.split('"')[1], "r")
			content += base64.b64encode(
				preProcess(f.read(), corejsB64, corewasmB64).encode("utf-8")
				).decode("ascii")
			content += "';"

			f.close()
		else:
			content = f'/* UNKNOWN COMMAND "{js[loc+3:].split("\n")[0]}" */'
		js = js[:loc] + content + after
	return js.replace(r"{{base64_corejs}}", corejsB64).replace(r"{{base64_corewasm}}", corewasmB64)

def createBundle(corejsB64, corewasmB64, outName):
	f = open(TEMPLATE, "r")
	js = f.read()
	f.close()
	
	js = preProcess(js, corejsB64, corewasmB64)

	f = open(outName, "w")
	f.write(js)
	f.close()

def local():
	f = open(FFMPEG_CORE_WASM, "rb")
	wasm = f.read()
	f.close()
	f = open(FFMPEG_CORE_JS, "rb")
	js = f.read()
	f.close()

	createBundle(
		base64.b64encode(js).decode("ascii"),
		base64.b64encode(wasm).decode("ascii"),
		os.path.join(os.path.dirname(SRC_DIR), "local.js")
	)
local()




