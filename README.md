# FFmpeg.js

A better ffmpeg.wasm front end, allowing for it to be included in a single line of js, and is independent of the ffmpeg-core version.


See the demo page [here](https://heronerin.github.io/FFmpeg-js/out/)



# FFmpeg Async Command API

This documentation describes the available asynchronous functions for interacting with an in-memory FFmpeg filesystem.

## Usage

All functions are asynchronous and should be called using `await`.

```js
let dirs = await ffmpeg.listDir(".");
```

## Usage

### `listDir(path)`

Lists the contents of a directory.

- **Parameters:**
  - `path` (string): The directory path to list.
- **Returns:** `string[]` - An array of filenames in the directory.
- **Example:**

  ```js
  let dirs = await ffmpeg.listDir(".");
  console.log(dirs);
  ```

### `mkdir(path)`

Creates a new directory.

- **Parameters:**
  - `path` (string): The directory path to create.
- **Returns:** `string` - The created directory path.
- **Example:**

  ```js
  await ffmpeg.mkdir("/new-folder");
  ```

### `readFileToUrl(path)`

Reads a file and returns a blob URL.

- **Parameters:**
  - `path` (string): The file path to read.
- **Returns:** `string` - A blob URL representing the file contents.
- **Example:**

  ```js
  let fileUrl = await ffmpeg.readFileToUrl("video.mp4");
  console.log(fileUrl);
  ```

### `rename(oldname, newname)`

Renames a file or directory.

- **Parameters:**
  - `oldname` (string): The current file/directory name.
  - `newname` (string): The new name.
- **Returns:** `string` - The new name.
- **Example:**

  ```js
  await ffmpeg.rename("old.mp4", "new.mp4");
  ```

### `writeFileFromUrl(path, url)`

Writes a file from a given URL to the FFmpeg filesystem.

- **Parameters:**
  - `path` (string): The target file path.
  - `url` (string): The source URL of the file.
- **Returns:** `string` - The written file path.
- **Example:**

  ```js
  await ffmpeg.writeFileFromUrl("video.mp4", "https://example.com/video.mp4");
  ```

### `exec(args)`

Executes an FFmpeg command.

- **Parameters:**
  - `args` (string[]): An array of command-line arguments for FFmpeg.
- **Returns:** The execution result.
- **Example:**

  ```js
  let result = await ffmpeg.exec(["-i", "input.mp4", "-vf", "scale=1280:720", "output.mp4"]);
  console.log(result);
  ```
  
### `writeFile(path, data)`

Writes data to a file in the FFmpeg filesystem.

- **Parameters:**
  - `path` (string): The target file path.
  - `data` (Uint8Array | string): The data to write.
- **Returns:** `string` - The written file path.
- **Example:**
  ```js
  let data = new Uint8Array([0x00, 0x01, 0x02]);
  await ffmpeg.writeFile("file.bin", data);
  ```

### `readFile(path, isString)`

Reads a file from the FFmpeg filesystem.

- **Parameters:**
  - `path` (string): The file path to read.
  - `isString` (boolean): Whether to decode the file as a string.
- **Returns:** `Uint8Array | string` - The file contents.
- **Example:**
  ```js
  let binaryData = await ffmpeg.readFile("file.bin");
  let textData = await ffmpeg.readFile("file.txt", true);
  ```

### `setLogger(func)`

Sets the logging function.

- **Parameters:**
  - `func` (function): A function that receives log messages.
- **Example:**
  ```js
  ffmpeg.setLogger(console.log);
  ```

### `setProgress(func)`

Sets the progress tracking function.

- **Parameters:**
  - `func` (function): A function that receives progress updates.
- **Example:**
  ```js
  ffmpeg.setProgress(progress => console.log("Progress:", progress));
  ```



