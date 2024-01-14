// Test.js
import React, { useState } from 'react';
import { confirm } from '../../components/confirm/ConfirmGlobal'; 

function Test() {
    const [count, setCount] = useState(0);

    const increment = async () => {
        if (await confirm({ title: "Voulez-vous vraiment incrémenter ?", content: "Ceci est le contenu personnalisé" })) {
            setCount((n) => n + 1);
        }
    }
    

    return (
        <>
            <p>Compteur : {count} </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={increment}>Incrémenter</button>
            </div>
        </>
    );
}

export default Test;
