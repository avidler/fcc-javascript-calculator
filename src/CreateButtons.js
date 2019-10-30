import React from 'react';

const CreateButtons = props => {
  return (
    <>
        <button 
            className="button" 
            onClick={(e) => props.handleClick(props.info.content)} 
            id={props.info.id} 
            
        >
            {props.info.content}
        </button>
    </>
  );
}

export default CreateButtons