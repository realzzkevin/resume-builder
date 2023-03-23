import React, { useState } from "react";
import Loading from "./Loading";

const Home = () => {
    const [fullName, setFullName] = useState("");
    const [currentPosition, setCurrentPosition] = useState("");
    const [currentLength, setCurrentLength] = useState(1);
    const [currentTechnologies, setCurrentTechnologies] = useState("");
    const [headshot, setHeadshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [companyInfo, setCompanyInfo] = useState([{ name: "", position: ""}]);

    const handleAddCompany = () => {
        setCompanyInfo([...companyInfo, {name: "", position: ""}]);
    };

    const handleRemoveCompany = (index) => {
        const list = [...companyInfo];
        list.splice(index, 1);
        setCompanyInfo(list);
    };

    const handleUpdateCompany = (e, index) => {
        const {name, value} = e.target;
        const list = [...companyInfo];
        list[index][name] = value;
        setCompanyInfo(list);
    };
    const handleFromSubmit = (e) => {
        e.preventDefault();
        console.log({
            fullName,
            currentPosition,
            currentLength,
            currentTechnologies,
            headshot,
        });
        setLoading(true);
    }
    if(loading) {
        return <Loading />;
    }
    return (
        <div className="app">
            <h1>Resume Builder</h1>
            <p>Generate a resume with ChatGPt in few seconds</p>
            <form on onSubmit={handleFromSubmit} method='POST' encType="multipart/form-data">
                <label htmlFor="fullName">Enter your full name</label>
                <input
                    type='text'
                    required
                    name='fullName'
                    id='fullName'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <div className='nestedContainer'>
                    <div>
                        <label htmlFor='currentPosition'>
                            Current Position
                        </label>
                        <input
                            type='text'
                            required
                            name='currentPosition'
                            className='currrentInput'
                            value={currentPosition}
                            onchange={(e) => setCurrentPosition(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='currentLength'>
                            For how long? (year)
                        </label>
                        <input
                            type='number'
                            required
                            name='currentLength'
                            className='currentInput'
                            value={currentLength}
                            onChange={(e) => setCurrentLength(e.target.value)}
                        />
                    </div>
                    <div>
                            <label htmlFor='currentTechnology'>
                                Technologies used
                            </label>
                            <input
                                type='text'
                                required
                                name='currentTechnologies'
                                className="'curretIput"
                                value={currentTechnologies}
                                onchange={(e) => setCurrentTechnologies(e.target.value)} 
                            />                           
                    </div>

                        
                </div>
                <lable htmlFor='photo'>
                    Upload your headshot image
                </lable>
                <input
                    type='file'
                    name='photo'
                    required
                    id='photo'
                    accept='image/x-png,image/jpeg'
                    onChange={(e) => setHeadshot(e.target.files[0])}
                />

                <h3>Companies you've worked at</h3>
                <form>
                    {companyInfo.map((company, index) => (
                        <div className='nestedContainer' key={index}>
                            <div className='companies'>
                                <label htmlFor='name'>Company Name</label>
                                <input
                                    type='text'
                                    name='name'
                                    required
                                    onchange={(e) => handleUpdateCompany(e, index)}
                                />
                            </div>
                            <div className='companies'>
                                <label htmlFor='position'>Position Held</label>
                                <input
                                    type='text'
                                    name='position'
                                    required
                                    onChange={(e) => handleAddCompany(e, index)} 
                                />
                            </div>
                            <div className='btn_group'>
                                {companyInfo.length - 1 === index && companyInfo.length < 4 && (
                                    <button id='addBtn' onClick={handleAddCompany}>
                                        Add
                                    </button>
                                )}
                                {companyInfo.length > 1 && (
                                    <button id='deleteBtn' onClick={() => handleRemoveCompany(index)}>
                                        Del
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </form>
                <button>Create Resume</button>
            </form>
        </div>
    );
};

export default Home;