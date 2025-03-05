async function createFFmpegCore(){
    let mod = await import ("data:application/javascript;base64,{{base64_corejs}}");
    return await mod.default({
            mainScriptUrlOrBlob : "#" + btoa(JSON.stringify({ wasmURL: "data:application/wasm;base64,{{base64_corewasm}}" }))
        }
    );
}

function postError(data, error_msg){
    postMessage(JSON.stringify({
        uuid: data.uuid,
        state: "error",
        error_msg: error_msg
    }));
}


#!include "common.js"

var ffmpeg = null;
self.onmessage = function(e) {
    let data = JSON.parse(e.data);
    console.log(data);

    let cmd = commands[data.cmd];
    if (data.args.length != cmd.args)
        return postError(data, `Internel error: ${data.cmd} must have ${cmd.args} arg(s)`);
    if (cmd.needsLoaded && null == ffmpeg)
        return postError(data, `Internel error: ${data.cmd} needs ffmpeg core to be loaded!`);
    
    
    try{
        cmd.func((ret)=> postMessage(JSON.stringify({
                    uuid: data.uuid,
                    state: "success",
                    data: ret
            })), 
        ...data.args);
    } catch(e){
        postError(data, e.message)
    }
};



