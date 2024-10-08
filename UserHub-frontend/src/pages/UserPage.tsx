import React, { useEffect } from 'react'
import { useState } from "react";
import axios from 'axios';
import Helpers from '../config/Helpers';

interface User {
  name: string;
  email: string;
  password: string;
  image: File | null | string;
}

interface UserArrayData {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
}

const UserPage = () => {

  const defaultUserValues: User = {
    name: "",
    email: "",
    password: "",
    image: null,
  };

  const defaultUserArrayData: UserArrayData = {
    id: "",
    name: "",
    email: "",
    password: "",
    image: "",
  };


  const [user, setUser] = useState<User>(defaultUserValues);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [userArray, setUserArray] = useState<UserArrayData[]>([defaultUserArrayData]);
  const [refresher, setRefresher] = useState<Boolean>(false);
  const [isEditModeEnabled, setIsEditModeEnabled] = useState<Boolean>(false);
  const [userId, setUserId] = useState<String>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setUser((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const editUser = (id: string, name: string, email: string, password: string, image: string) => {
    setUserId(id)
    setPreviewImage(Helpers.imageUrl + image);
    setUser({
      name: name,
      email: email,
      password: password,
      image: image,
    })
    setIsEditModeEnabled(true);
  }


  const submitUserData = () => {
    const formData: any = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    if (user.image) {
      typeof user.image === "string" ? formData.append("imageString", user?.image) : formData.append("image", user?.image)
      typeof user.image === "string" ? formData.append("image", null) : formData.append("imageString", "")
    }
    const METHOD = isEditModeEnabled ? axios.put : axios.post
    const URL: string = isEditModeEnabled ? `${Helpers.apiUrl}user/edit-user/${userId}` : `${Helpers.apiUrl}user/add-user`
    METHOD(URL, formData, Helpers.authFileHeaders)
      .then((response) => {
        console.log(response)
        setRefresher(!refresher)
        setUser({
          name: "",
          email: "",
          password: "",
          image: ""
        })
        setPreviewImage(null);
        setIsEditModeEnabled(false);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getUsers = () => {
    axios.get(`${Helpers.apiUrl}user/get-users`)
      .then((response) => {
        console.log(response.data.users)
        setUserArray(response.data.users);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const deleteUser = (userId: String) => {
    axios.delete(`${Helpers.apiUrl}user/delete-users/${userId}`)
      .then((response) => {
        console.log(response)
        setRefresher(!refresher)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getUsers();
  }, [refresher])


  return (
    <div className='flex flex-col items-center justify-center p-5' >
      <div className='rounded-xl flex flex-col  items-center justify-center shadow-lg w-[90vw] max-w-4xl bg-white h-auto md:h-[75vh]  '>
        <div className='w-full ' >
          <h1 className='text-gray-500 px-12  text-2xl font-semibold' >Create Users</h1>
        </div>
        <div className='flex flex-row items-center justify-center w-full -mt-4' >
          <form
            className='w-full md:w-[60%] h-full flex flex-col gap-6 items-center justify-center'
            onSubmit={(e) => {
              e.preventDefault();
              submitUserData();
            }}
          >
            <input
              className='border px-4 py-2 bg-gray-100 rounded-lg outline-none w-full md:w-[80%] h-12 focus:border-blue-500 focus:bg-white transition-all duration-200'
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
            />
            <input
              className='border px-4 py-2 bg-gray-100 rounded-lg outline-none w-full md:w-[80%] h-12 focus:border-blue-500 focus:bg-white transition-all duration-200'
              type="text"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
            />
            <input
              className='border px-4 py-2 bg-gray-100 rounded-lg outline-none w-full md:w-[80%] h-12 focus:border-blue-500 focus:bg-white transition-all duration-200'
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
            />
            <div className='w-full md:w-[80%] flex justify-start'>
              <button
                type='submit'
                className='w-full md:w-32 bg-blue-500 hover:bg-blue-600 h-9 rounded-lg text-white font-semibold transition-all duration-200'
              >
                Submit
              </button>
            </div>
          </form>

          <div className='w-full md:w-[40%] h-[60vh] md:p-10 flex items-center justify-center'>
            {previewImage ? (
              <label htmlFor="user-image">
                <img
                  className='border border-dashed border-gray-400 w-full h-48 md:h-full rounded-xl object-cover' // Ensure the image fits nicely
                  src={previewImage}
                  alt="Preview"
                />
              </label>
            ) : (
              <label
                htmlFor="user-image"
                className='border border-dashed border-gray-400 w-full h-48 md:h-full rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all duration-200'
              >
                Select Image
              </label>
            )}
          </div>

        </div>
        <input
          onChange={handleImage}
          id="user-image"
          type="file"
          accept="image/*"
          className='sr-only'
        />
      </div>
      <div className='w-full h-full flex items-center justify-center mt-5 ' >
        <div className="overflow-x-auto bg-white px-7 py-5 rounded-2xl shadow">
          <table className="table">
            {/* head */}
            <thead>
              <tr className='text-gray-600' >
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {
                userArray.map((items) => (
                  <tr>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={Helpers.imageUrl + items.image}
                              alt={Helpers.imageUrl + items.image} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-500">{items.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className='text-gray-400' >
                      {items.email}
                    </td>
                    <th>
                      <button
                        onClick={() => editUser(items.id, items.name, items.email, items.password, items.image)}
                        className="btn btn-primary text-white btn-xs">Edit-User</button>
                    </th>
                    <th>
                      <button
                        onClick={() => deleteUser(items.id)}
                        className="btn btn-error text-white btn-xs">Delete-User</button>
                    </th>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserPage