import React, { useState } from 'react';
import './vote.css';

import { toast } from 'react-toastify';

const AddVote = ({ state }) => {
    const { contract, hcsClient } = state;
    
    const [candidateId, setCandidateId] = useState('');
    const [voterId, setVoterId] = useState('');

    const addVote = async () => {
        try {
            const voteMessage = `Vote from ${voterId} for candidate ${candidateId}`;
            const { consensusTimestamp } = await hcsClient.submitMessage(voteMessage);
            const gasLimit = 10000000;
            const transaction = await contract.addVote(voterId, candidateId, consensusTimestamp, { gasLimit });
            const receipt = await transaction.wait();
            
            if (receipt.status === 1) {
                console.log('Transaction is done');
                toast.success('Vote added to respective candidate');
            } else {
                console.error('Transaction failed:', receipt.transactionHash);
                toast.error('Error adding vote. Transaction failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error adding vote. Please check the console for details.');
        }
    };

    return (
        <>
            <div>
                <h1 style={{ fontFamily: 'fantasy', textAlign: "center" }}>Vote</h1>
            </div>
            <div>
                <form>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            placeholder="Enter Candidate's ID"
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            placeholder="Enter Voter's ID"
                            value={voterId}
                            onChange={(e) => setVoterId(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '10vh' }}>
                <button className="dark-button" type="button" onClick={addVote}>
                    VOTE
                </button>
            </div>

        </>
    );
};

export default AddVote;
