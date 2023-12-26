import { useContext } from "react";
import { AuthOptions } from "../authentication/AuthOptions";

export default function fetchCustomerId(username, password) {
    const { loggedIn } = useContext(AuthOptions)
    axios
        .post("http://127.0.0.1:5000/api/login/", { username, password })
        .then(function (response) {
            const cID = response.data.cID;
            const username = response.data.username;
            if (typeof (cID) == "number") {
                loggedIn(username, cID);
                console.log("Logged in", cID);
                navigate("/");
            }
            else {
                console.log("Invalid username or password");
            }
            //return response.data.cID;
        })
        .catch(function (error) {
            console.log(error, "there");
            alert("Incorrect Username/Password Combination, Please Try Again!");
            //    return null;
        });
}