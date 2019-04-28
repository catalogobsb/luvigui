import React from 'react';
// import { css } from '@emotion/core';
// Another way to import
import BeatLoader from 'react-spinners/BeatLoader';



const styles = {
    testClass: {
        textAlign: "center",
        display: "block",
        margin: "0 auto",
        borderColor: "red"
    }
}



const LoadingSpinner = (props) => (
    <div style={{textAlign: "center",
        display: "block",
            display: "block",
            margin: "0 auto",
        borderColor: "red"}}>
        <BeatLoader
            sizeUnit={"px"}
            size={12}
            color={'red'}
            loading="true"
        />
    </div>
);

export default LoadingSpinner;