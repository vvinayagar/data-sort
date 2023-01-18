import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

interface Record {
  name: string;
  id: string;
  tags: string[];
}

const App: React.FC = () => {
  const [records, setRecords] = useState<any>([]);
  const [commonTagPairs, setCommonTagPairs] = useState<string[]>([]);

  useEffect(() => {
    // load json file and set records state
    fetch("/api/posts/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Record Retrienved");
        console.log(data);
        setRecords(data)
      });

    const getData = async () => {

      //Get Data
      let response = await axios.get("/api/posts/");

      //Separate Post Data
      let recipients: Record [] = response.data.recipients;

      setRecords(recipients);

      console.log("Record Retrieved");
    };

    getData();
  }, []);

  useEffect(() => {

    console.log("Record Processing");
    // find common tag pairs
    let pairs: string[] = [];
  
    if(records == null || records == undefined || records.length == 0){
      return;
    }
    for (let i = 0; i < records.recipients.length; i++) {
      for (let j = i + 1; j < records.recipients.length; j++) {
        let commonTags = records.recipients[i].tags.filter((tag:any) =>
          records.recipients[j].tags.includes(tag)
        );
        if (commonTags.length >= 2) {
          pairs.push(
            `${records.recipients[i].name}, ${records.recipients[j].name} - [${commonTags.join(", ")}]`
          );
        }
      }
    }
    setCommonTagPairs(pairs);
  }, [records]);

  return (
    <div>
      {commonTagPairs.map((pair) => (
        <p>{pair}</p>
      ))}
    </div>
  );
};

export default App;
