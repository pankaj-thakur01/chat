import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/Authcontext'

function Login() {

  const [currState, setCurrState] = useState("signup")
  const [fullname, setfullname] = useState("")
  const [email, setemail] = useState("")
  const [pass, setpass] = useState("")
  const [bio, setbio] = useState("")
  const [isdatasubmitted, setisdatasubmitted] = useState(false)

 const {login } = useContext(AuthContext)

const onsubmithandler = (e) => {
e.preventDefault()
 if(currState === "signup" && !isdatasubmitted) {
   setisdatasubmitted(true)
   return;
    }

login(currState === "signup" ? 'signup': 'login', {fullname,email,pass,bio})

  }





  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-100 sm:jusify-evenly max-sm:flex-col backdrop-blur-2xl'>


      {/* .........................LEFT .................................... */}

      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

      {/* ............................................RIGHT......................................................... */}

      <form onSubmit={onsubmithandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center' >
          {currState}
          {isdatasubmitted && <img onClick={() => setisdatasubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
          }

        </h2>

        {currState === "signup" && !isdatasubmitted && (
          <input value={fullname} onChange={(e) => setfullname(e.target.value)} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
        )}

        {!isdatasubmitted && (
          <>
            <input value={email} onChange={(e) => setemail(e.target.value)} type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />

            <input value={pass} onChange={(e) => setpass(e.target.value)} type="Password" placeholder='Enter Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />

          </>
        )}


        {

          currState === "signup" && isdatasubmitted && (
            <textarea onChange={(e) => setbio(e.target.value)} value={bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Provide a short bio...' required ></textarea>

          )}



        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-voilet-600 text-white rounded-md cursor-poniter'>
          {currState === "signup" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "signup" ? (
            <p className='text-sm text-gray-600' >Already have an account ? <span onClick={() => { setCurrState("Login"); setisdatasubmitted(false) }} className='font-medium text-violet-500 cursor-pointer'>Login here</span>  </p>
          ) : (
            <p className='text-sm text-gray-600' >Create an account  <span onClick={() => { setCurrState("signup") }} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}

        </div>

      </form>


    </div>
  )
}

export default Login