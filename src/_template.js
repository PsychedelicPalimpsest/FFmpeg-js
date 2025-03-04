// I am not using any special JS bundler like webpack,
// so I am just using some custom python code. SUE ME



(function(){
#!include "common.js"
#!b64_include worker64, "worker.js"

	function FFmpeg(){
		let callbacks = {};

		let blob = URL.createObjectURL(new Blob([atob(worker64)], {type: "application/javascript"}));
		let worker = new Worker(blob);
		this.worker = worker;
		worker.onerror = console.warn;
		worker.onmessage = function(e){
			let data = JSON.parse(e.data);
			if (data["state"] == "error"){
				callbacks[data.uuid][1](new Error(data.error_msg));
			}else{
				callbacks[data.uuid][0](data.data);
			}

		}


		for (let func of Object.keys(commands)){
			let cmd = commands[func];
			this[func] = function(...args){
				return new Promise((...callback)=>{
					let id = ""+(Math.random() * 2**64);
					callbacks[id] = callback;

					worker.postMessage(JSON.stringify({
						uuid: id,
						cmd: func,
						args: args
					}));
				});
			}
		}
		this["writeFile"] = async function(path, data){
			let blob = new Blob([data]);
			let url = URL.createObjectURL(blob);
			let r = await this.writefileFromUrl(path, url);
			URL.revokeObjectURL(url);
			return r;
		};
		this["readFile"] = async function(path, isString){
			let url = await this.readFileToUrl(path);
			let req = await fetch(url);
			let ret = await req.bytes();

			if (isString){
				let d = new TextDecoder()
				ret = d.decode(ret);
			}
			URL.revokeObjectURL(url);
			return ret;
		}
	}

	
	window.createFFmpeg = async function(){
		let ff = new FFmpeg();
		await ff._load();
		return ff;
	}
})();