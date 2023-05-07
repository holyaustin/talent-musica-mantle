import { useEffect, useRef } from "react";
import "./Stream.css";
import { Client } from "@livepeer/webrtmp-sdk";

function Stream() {
  // const inputEl = useRef(null);
  const videoEl = useRef(null);
  const stream = useRef(null);

  useEffect(() => {
    (async () => {
      videoEl.current.volume = 0;

      stream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoEl.current.srcObject = stream.current;
      videoEl.current.play();
    })();
  });

  const onButtonClick = async () => {
    // const streamKey = inputEl.current.value;
    const streamKey = "1424-9sme-iisq-8r5o";

    if (!stream.current) {
      alert("Video stream was not started.");
    }

    if (!streamKey) {
      alert("Invalid streamKey.");
      return;
    }

    const client = new Client();

    const session = client.cast(stream.current, streamKey);

    session.on("open", () => {
      console.log("Stream started.");
      alert("Stream started; visit Livepeer Dashboard.");
    });

    session.on("close", () => {
      console.log("Stream stopped.");
    });

    session.on("error", (err) => {
      console.log("Stream error.", err.message);
    });
  };

  return (
    <div className="App">

      <video className="App-video" ref={videoEl}>
        <track
          default
          kind="captions"
          srcLang="en"
          src="/media/examples/friday.vtt"
        />
      </video>
      <button type="button" className="App-button" onClick={onButtonClick}>
        Start
      </button>

    </div>
  );
}

export default Stream;
