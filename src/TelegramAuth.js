// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TelegramAuth = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState('');
//   const [userData, setUserData] = useState(null);

//   const BACKEND_URL = 'http://localhost:5000';
//   const BOT_ID = '7633674228';
//   const REDIRECT_ORIGIN = 'https://9037-2405-201-a403-a0d0-d6bb-8af7-1bc4-e483.ngrok-free.app';

//   useEffect(() => {
//     const connected = localStorage.getItem('telegramConnected');
//     const savedUserData = localStorage.getItem('telegramUserData');
    
//     if (connected === 'true' && savedUserData) {
//       setIsConnected(true);
//       setUserData(JSON.parse(savedUserData));
//     }

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   const handleMessage = (event) => {
//     console.log('Received message:', event.data); // Debug log

//     if (new URL(event.origin).origin !== new URL(REDIRECT_ORIGIN).origin) {
//       console.log('Origin mismatch:', event.origin); // Debug log
//       return;
//     }

//     try {
//       const data = event.data;
//       console.log('Parsed data:', data); // Debug log
      
//       if (data && data.user) {
//         handleTelegramCallback({
//           id: data.user.id,
//           first_name: data.user.first_name,
//           username: data.user.username,
//           photo_url: data.user.photo_url,
//           auth_date: data.user.auth_date,
//           hash: data.hash
//         });
//       } else if (data.status === 'decline') {
//         setError('Login was cancelled');
//       }
//     } catch (error) {
//       console.error('Error processing auth response:', error);
//       setError('Failed to process authentication response');
//     }
//   };

//   const handleTelegramLogin = () => {
//     setError('');
//     const width = 550;
//     const height = 470;
//     const left = window.innerWidth / 2 - width / 2;
//     const top = window.innerHeight / 2 - height / 2;

//     const authUrl = new URL('https://oauth.telegram.org/auth');
//     authUrl.searchParams.append('bot_id', BOT_ID);
//     authUrl.searchParams.append('origin', REDIRECT_ORIGIN);
//     authUrl.searchParams.append('request_access', 'write');
//     authUrl.searchParams.append('return_to', `${REDIRECT_ORIGIN}/auth_callback`); // Update the redirect URL here if needed

//     const authWindow = window.open(
//       authUrl.toString(),
//       'TelegramLogin',
//       `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
//     );

//     if (!authWindow) {
//       setError('Popup was blocked. Please allow popups and try again.');
//       return;
//     }

//     const checkClosed = setInterval(() => {
//       if (authWindow.closed) {
//         clearInterval(checkClosed);
//         if (!isConnected) {
//           setError('Authentication window was closed');
//         }
//       }
//     }, 1000);
//   };

//   const handleTelegramCallback = async (userData) => {
//     try {
//       console.log('Processing user data:', userData); // Debug log

//       const response = await axios.post(`${BACKEND_URL}/api/auth/telegram`, {
//         user: userData
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         setIsConnected(true);
//         setUserData(userData);
//         localStorage.setItem('telegramConnected', 'true');
//         localStorage.setItem('telegramUserData', JSON.stringify(userData));
//         setError('');
//       } else {
//         throw new Error(response.data.message || 'Authentication failed');
//       }
//     } catch (error) {
//       console.error('Telegram auth error:', error);
//       setError(error.message || 'Connection failed. Please try again later.');
//       setIsConnected(false);
//       localStorage.removeItem('telegramConnected');
//       localStorage.removeItem('telegramUserData');
//     }
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setUserData(null);
//     localStorage.removeItem('telegramConnected');
//     localStorage.removeItem('telegramUserData');
//     setError('');
//   };

//   return (
//     <div className="auth-container">
//       {!isConnected ? (
//         <>
//           <button 
//             onClick={handleTelegramLogin}
//             className="connect-button"
//           >
//             Connect Telegram
//           </button>
//           {error && <p className="error-message">{error}</p>}
//         </>
//       ) : (
//         <div className="connected-status">
//           {userData && (
//             <div className="user-info">
//               {userData.photo_url && (
//                 <img 
//                   src={userData.photo_url} 
//                   alt="Profile" 
//                   className="profile-photo"
//                   style={{ width: '50px', borderRadius: '50%' }}
//                 />
//               )}
//               <p>Welcome, {userData.username || userData.first_name}!</p>
//             </div>
//           )}
//           <button 
//             onClick={handleDisconnect}
//             className="disconnect-button"
//           >
//             Disconnect
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TelegramAuth;




// const BOT_ID = "7633674228";

// const { onAuth, isLoading } = await useTelegramAuth(BOT_ID);

// // Validate the result on server-side!



import React, { useState } from 'react'
import useTelegramAuth from "@use-telegram-auth/hook"

const TelegramAuth = () => {
    const BOT_ID = "7633674228"
    const [isLoading, setIsLoading] = useState(false)

    const { onAuth } = useTelegramAuth(
        BOT_ID,
        {
            windowFeatures: { popup: true }
        },
        {
            onSuccess: async(result) => {
                
                
                try {
                    const response = await fetch('http://localhost:5000/api/auth/telegram', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(result)
                    });

                    const data = await response.json();
                    console.log(data,"hellooooooooooooooooooooooooooooooooooooo");
                    
                    if (data.success) {
                       
                    } else {
                        console.error('Authentication failed:', data.message);
                    }
                } catch (error) {
                    console.error('Error during authentication:', error);
                }
               
            }
        }
    )

    const handleAuth = async () => {
        try {
            setIsLoading(true)
            await onAuth()
        } catch (error) {
            console.error('Authentication failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button onClick={handleAuth} disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Login"}
        </button>
    )
}

export default TelegramAuth