
const commands = {
	listDir:{
		args: 1,
		needsLoaded : true,
		func: function(callback, path){
			callback(ffmpeg.FS.readdir(path));
		}
	},
	mkdir: {
		args: 1,
		needsLoaded: true,
		func: function(callback, path){
			ffmpeg.FS.mkdir(path);
			callback(path);
		}
	},
	readFileToUrl: {
		args: 1,
		needsLoaded: true,
		func: function(callback, path){
			let bin = ffmpeg.FS.readFile(path, {encoding: "binary"});
			callback(URL.createObjectURL(new Blob([bin])));
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
			ffmpeg.setProgress((progress)=>{
				postMessage(JSON.stringify({
			      state: "progress",
			      data: progress
			   }));
			});
			ffmpeg.setLogger((log)=>{
				postMessage(JSON.stringify({
			      state: "log",
			      data: log
			   }));
			});
			callback(true);
		}
	},
	exec:{
		args: 1,
		needsLoaded : true,
		func: function(callback, args){
			callback(ffmpeg.exec(...args));
		}
	}
};