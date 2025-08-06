import { createContext, useContext, useState } from "react";
import MyDropzone from "./MyDropzone";
import { CircleX, Pencil, Save } from "lucide-react";

const EditContext = createContext();

export default function ProfileManagement() {
  const [isEditing, setIsEditing] = useState(false);

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

function ProfileGrid({ isEditing }) {
  const { enableEditing, cancelEditing } = useContext(EditContext);

  return (
    <form className="grid grid-cols-2 gap-5">
      <Field fname="Name" ftype="text" ph="Enter your name" />
      <Field fname="Email" ftype="email" ph="Enter your email" />
      <Field fname="Phone Number" ftype="phone" ph="Enter your number" />
      <Field fname="Role" ftype="text" ph="Enter your role" />
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

function Field({ fname, ftype, ph }) {
  return (
    <div className="w-[20vw]">
      <label className="block text-lg font-semibold mb-2">{fname}</label>
      <input
        type={ftype}
        placeholder={ph}
        required
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
