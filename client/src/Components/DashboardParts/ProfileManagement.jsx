import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { CircleX, FileText, Pencil, Save, SquarePen } from "lucide-react";
import { openDB } from "idb";
import { useAuth } from "../../hook/auth";

const EditContext = createContext();

const initialState = {
  role: "",
  resumeFile: null,
  resumeURL: "",
  fileName: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "submit":
      return {
        ...state,
        role: action.payload.role,
        resumeFile: action.payload.resumeFile,
      };

    case "edit/role":
      return { ...state, role: action.payload };

    case "edit/resume":
      return {
        ...state,
        resumeFile: action.payload.file,
        resumeURL: action.payload.url,
        fileName: action.payload.fileName,
      };

    default:
      return state;
  }
}

export default function ProfileManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token } = useAuth();

  function enableEditing(e) {
    e.preventDefault();
    setIsEditing(true);
  }

  function cancelEditing(e) {
    e.preventDefault();
    setIsEditing(false);
  }

  async function updateDB(newData) {
    const db = await openDB("userDB", 1);
    const storedUser = await db.get("users", 1);

    if (storedUser) {
      if (newData.role !== undefined) {
        storedUser.role = newData.role;
      }
      if (newData.resumeFile !== undefined && newData.resumeFile !== null) {
        storedUser.resume = newData.resumeFile;
      }
      await db.put("users", storedUser);
    }
  }

  useEffect(() => {
    async function fetchUserDetails() {
      const db = await openDB("userDB", 1);
      const storedUser = await db.get("users", 1);

      if (storedUser) {
        dispatch({ type: "edit/role", payload: storedUser.role });

        if (storedUser.resume instanceof Blob) {
          dispatch({
            type: "edit/resume",
            payload: {
              file: storedUser.resume,
              url: URL.createObjectURL(storedUser.resume),
              fileName: storedUser.resume.name || "resume",
            },
          });
        } else {
          dispatch({
            type: "edit/resume",
            payload: { file: null, url: "", fileName: "" },
          });
        }
      }
    }

    fetchUserDetails();
  }, []);

  return (
    <EditContext.Provider
      value={{
        enableEditing,
        cancelEditing,
        dispatch,
        state,
        isEditing,
        setIsEditing,
        updateDB,
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
  const {
    isEditing,
    enableEditing,
    cancelEditing,
    dispatch,
    state,
    setIsEditing,
    updateDB,
  } = useContext(EditContext);

  const { role, resumeFile } = state;
  const { user } = useAuth();
  const { name, email } = user;

  function handleRole(e) {
    dispatch({ type: "edit/role", payload: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "submit", payload: state });
    updateDB({ role, resumeFile });

    try {
      const data = new FormData();
      data.append("targetRole", role);
      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      const response = await fetch("http://localhost:5000/updateProfile", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile updated:", result);
    } catch (err) {
      console.error(err);
    }

    setIsEditing(false);
  }

  return (
    <form className="grid grid-cols-2 gap-5">
      <Field fname="Name" ftype="text" ph="" val={name} />
      <Field fname="Email" ftype="email" ph="" val={email} />
      <Field
        fname="Role"
        ftype="text"
        ph="Enter your role"
        val={role}
        handler={handleRole}
      />
      <Resume />
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

function Resume() {
  const { state, isEditing, dispatch } = useContext(EditContext);
  const { fileName, resumeURL } = state;

  return (
    <div className="col-span-2 w-[40vw] flex flex-col">
      <p className="text-lg font-semibold mb-2">Resume</p>
      <div className="flex gap-4 items-center">
        <div className="border w-fit p-4 rounded-lg flex gap-2 bg-gradient-to-r from-teal-50 to-emerald-50">
          <FileText />
          <p>{fileName}</p>
          {resumeURL && (
            <a
              target="_blank"
              rel="noreferrer"
              href={resumeURL}
              className="text-blue-500 hover:text-blue-800"
            >
              (Click to view)
            </a>
          )}
        </div>
        {isEditing && (
          <label className="flex border h-fit p-2 px-5 gap-2 rounded-xl bg-blue-600 text-white items-center cursor-pointer">
            <SquarePen size={20} />
            <p>Update</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  dispatch({
                    type: "edit/resume",
                    payload: {
                      file,
                      url: URL.createObjectURL(file),
                      fileName: file.name,
                    },
                  });
                }
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

function Field({ fname, ftype, ph, val, handler }) {
  const { isEditing } = useContext(EditContext);

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
        disabled={fname === "Name" || fname === "Email" ? true : !isEditing}
        required
        onChange={handler}
        className={`${
          (fname === "Name" || fname === "Email" ? true : !isEditing)
            ? "bg-gray-100"
            : ""
        } border rounded-lg px-2 py-1 w-full`}
      />
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
