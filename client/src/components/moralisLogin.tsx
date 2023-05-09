import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useNavigate } from "react-router-dom";

function MoralisLogin() {
  const navigate = useNavigate();
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user!.get("ethAddress"));
          navigate("/explore");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const logOut = async () => {
    await logout();
    console.log("logged out");
  };

  return (
    <div>
      <button
            type="button"
            onClick={login}
            className="w-full flex flex-row justify-center items-center my-5 bg-red-700 p-3 rounded-full cursor-pointer hover:bg-yellow-500 hover:text-white"
          >

            <p className="text-white text-2xl font-semibold py-1 px-6 mx-14 hover:text-red-700">
              Connect Wallet
            </p>
          </button>
      
      <button 
      onClick={logOut}
      className="w-full flex flex-row justify-center items-center my-5 bg-red-700 p-3 rounded-full cursor-pointer hover:bg-yellow-500 hover:text-white" 
      disabled={isAuthenticating}>
      <p className="text-white text-2xl font-semibold py-1 px-6 mx-14 hover:text-red-700">
      Logout
            </p>
        </button>
       
    </div>
  );
}

export default MoralisLogin;
