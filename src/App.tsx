import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { IoPlay } from "react-icons/io5";
import { FaPause } from "react-icons/fa6";
const fileSize = 0.11334;
const measureDownloadSpeed = async () => {
  let startTime = 0;
  try {
    await axios.get('https://www.gstatic.com/webp/gallery3/1.png', {
      onDownloadProgress: function () {
        startTime = startTime == 0 ? performance.now() : startTime;
      },
    });
    let endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    const speedMbps = ((fileSize) / duration) * 8;
    return Math.ceil(speedMbps);
  }
  catch (err) {
    console.log(err);
    return null;
  }

};

function App() {
  const [speed, setSpeed] = useState<number[]>([]);
  const [start, setStart] = useState<boolean>(false);
  useEffect(() => {
    let temp = 40;
    async function call() {
      for (let i = 0; i < temp; i++) {
        const tempSpeed = await measureDownloadSpeed();
        if (tempSpeed) {
          setSpeed(prev => [...prev, tempSpeed]);
        }
      }
    }
    if (start) {
      call();
    }
    return () => {
      temp = 0;
    }
  }, [start])

  const handleClick = () => {
    setStart(!start);
    setSpeed([])
  };
  useEffect(() => {
    if (speed.length == 40) {
      let totalSpeed = 0;
      for (let i = 0; i < 40; i++) {
        totalSpeed += speed[i];
      };
      setSpeed([Math.ceil(totalSpeed / 40)]);
      setStart(false);
    }
  }, [speed])
  return (
    <div className='app'>
      <div className='content'>
        <h1>{speed.length == 0 ? '00' : speed[speed.length - 1]}</h1> <span>Mbps</span>
      </div>
      <div className='action' onClick={handleClick}>
        {!start && <IoPlay size={25} />}
        {start && <FaPause />}
      </div>
    </div>
  )
}

export default App
