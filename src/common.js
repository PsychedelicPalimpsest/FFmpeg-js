
const commands = {
	listDir:{
		args: 1,
		needsLoaded : true,
		func: function(callback, path){
			callback(ffmpeg.FS.readdir(path));
		}
	},
	rename: {
		args: 2,
		needsLoaded : true,
		func: function(callback, oldname, newname){
			ffmpeg.FS.rename(oldname, newname);
			callback(newname);
		}
	},
	writefileFromUrl: {
		args: 2,
		needsLoaded : true,
		func: async function(callback, path, url){
			let req = await fetch(url);
			let bytes = await req.bytes();
			ffmpeg.FS.writeFile(path, bytes);
			callback(path);
		}
	},
	_load: {
		args: 0,
		needsLoaded : false,
		func: async function(callback){
			ffmpeg = await createFFmpegCore();
			callback(true);
		}
	}
};