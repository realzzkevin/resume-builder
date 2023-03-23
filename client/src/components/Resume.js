import React from "react";
import ErrorPage from "./ErrorPage";

const Resume =({ result}) => {
    if(JSON.stringify(result) === "{}") {
        return <ErrorPage/>;
    }

    const handlePrint = () => alert("print successful!");
    return (
        <>
            <button onClick={handlePrint}>Print Page</button>
            <main className='container'>
                <p>Hello!</p>
            </main>
        </>
    );
};

export default Resume;