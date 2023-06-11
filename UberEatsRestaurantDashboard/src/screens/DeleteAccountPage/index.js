import React, { useState } from 'react';
import {Auth, DataStore} from 'aws-amplify';
import {useAuthContext} from "../../contexts/AuthContext";

const DeleteAccountPage = () => {
    const [result, setResult] = useState(null);
    const {signOut:afterDelete}=useAuthContext()

    const handleDelete = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.deleteUser(user);
            setResult("Your account has been successfully deleted.");
        } catch (error) {
            setResult(`Error: ${error.message}`);
        }
        finally {
             // DataStore.clear().then(() => DataStore.start())
            afterDelete()
        }
    };

    const confirmDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete your account?");
        if (confirm) handleDelete().then();
    };

    return (
        <div style={{height:"100vh", textAlign:"center"}}>
            <h1>Delete Account</h1>
            <p>By clicking the button below, your account and all associated data will be permanently deleted.</p>
            <button onClick={confirmDelete}>Delete My Account</button>
            {result && <p>{result}</p>}
        </div>
    );
};

export default DeleteAccountPage;
