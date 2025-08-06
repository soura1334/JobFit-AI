import { createContext, use, useContext, useReducer, useState } from "react";
import MyDropzone from "./MyDropzone";
import { CircleX, Pencil, Save } from "lucide-react";

const EditContext = createContext();

const initialState = {
  name: "User",
  email: "user@email.com",
  phone: "+91-1800191192",
  role: "Software Developer",
};

function reducer(state, action) {
  switch (action.type) {
    case "submit":
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone,
        role: action.payload.role,
      };

    case "edit/name":
      return { ...state, name: action.payload };
    case "edit/phone":
      return { ...state, phone: action.payload };
    case "edit/email":
      return { ...state, email: action.payload };
    case "edit/role":
      return { ...state, role: action.payload };
  }
}

export default function ProfileManagement() {
  const [isEditing, setIsEditing] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  function enableEditing(e) {
    e.preventDefault();
    setIsEditing(true);
  }

  function cancelEditing(e) {
    e.preventDefault();
    setIsEditing(false);
  }

  return (
    <EditContext.Provider
      value={{
        enableEditing,
        cancelEditing,
        dispatch,
        state,
        isEditing,
        setIsEditing
      }}
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
        <div className="text-gray-600">
          <ProfileGrid isEditing={isEditing} />
        </div>
      </div>
    </EditContext.Provider>
  );
}

function ProfileGrid() {
  const { isEditing, enableEditing, cancelEditing, dispatch, state, setIsEditing } =
    useContext(EditContext);

  const { name, email, phone, role } = state;

  function handleName(e) {
    dispatch({ type: "edit/name", payload: e.target.value });
  }
  function handleEmail(e) {
    dispatch({ type: "edit/email", payload: e.target.value });
  }
  function handlePhone(e) {
    dispatch({ type: "edit/phone", payload: e.target.value });
  }
  function handleRole(e) {
    dispatch({ type: "edit/role", payload: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({type: 'submit', payload: state})
    setIsEditing(false);
  }

  return (
    <form className="grid grid-cols-2 gap-5" >
      <Field
        fname="Name"
        ftype="text"
        ph="Enter your name"
        val={name}
        handler={handleName}
      />
      <Field
        fname="Email"
        ftype="email"
        ph="Enter your email"
        val={email}
        handler={handleEmail}
      />
      <Field
        fname="Phone Number"
        ftype="phone"
        ph="Enter your number"
        val={phone}
        handler={handlePhone}
      />
      <Field
        fname="Role"
        ftype="text"
        ph="Enter your role"
        val={role}
        handler={handleRole}
      />
      <MyDropzone />
      <div className="flex flex-row-reverse col-span-2 gap-4">
        <Button
          status={isEditing ? "hidden" : ""}
          text="Edit Profile"
          comp={<Pencil size={20} />}
          col="bg-blue-600"
          hovcol="hover:bg-blue-700"
          handler={enableEditing}
        />
        <Button
          status={isEditing ? "" : "hidden"}
          text="Save"
          comp={<Save size={20} />}
          col="bg-blue-600"
          hovcol="hover:bg-blue-700"
          handler={handleSubmit}
        />
        <Button
          status={isEditing ? "" : "hidden"}
          text="Cancel"
          comp={<CircleX size={20} />}
          col="bg-red-600"
          hovcol="hover:bg-red-700"
          handler={cancelEditing}
        />
      </div>
    </form>
  );
}

function Field({ fname, ftype, ph, val, handler }) {

  const {isEditing} = useContext(EditContext);

  return (
    <div className="w-[20vw]">
      <label
        htmlFor={fname.toLowerCase()}
        className="block text-lg font-semibold mb-2"
      >
        {fname}
      </label>
      <input
        name={fname.toLowerCase()}
        type={ftype}
        placeholder={ph}
        value={val}
        disabled={!isEditing}
        required
        onChange={handler}
        className="border rounded-lg px-2 py-1 w-full"
      ></input>
    </div>
  );
}

function Button({ status, text, comp, col, hovcol, handler }) {
  return (
    <button
      className={`${status} ${col} col-span-2 justify-self-end text-white px-5 py-3 rounded-lg flex gap-2 items-center ${hovcol} cursor-pointer transition-all`}
      onClick={handler}
    >
      {comp}
      <p>{text}</p>
    </button>
  );
}
