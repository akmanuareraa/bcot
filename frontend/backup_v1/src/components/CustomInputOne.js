import React from "react";

function CustomInputOne(props) {
  return (
    <input
      type="text"
      className="border-2 border-black rounded-xl input w-60"
      placeholder='"HEA274"'
      onChange={(e) => {
        props.functioToCall(e.target.value);
      }}
    ></input>
  );
}

export default CustomInputOne;
