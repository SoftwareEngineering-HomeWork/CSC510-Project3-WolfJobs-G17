// import CreateIcon from '@mui/';
import { BiSolidPencil } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { useUserStore } from "../../store/UserStore";
import { useState } from "react";
import ProfileEdit from "./ProfileEdit";

const Profile = () => {
  const name = useUserStore((state) => state.name);
  const email = useUserStore((state) => state.email);
  const address = useUserStore((state) => state.address);
  const role = useUserStore((state) => state.role);
  const skills = useUserStore((state) => state.skills);
  const phonenumber = useUserStore((state) => state.phonenumber);
  const affiliation = useUserStore((state) => state.affiliation);
  const availability = useUserStore((state) => state.availability);
  const gender = useUserStore((state) => state.gender);
  const hours = useUserStore((state) => state.hours);
  const resume = useUserStore((state) => state.resume);

  const widthCard = "700px";

  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <div
        className="flex flex-col items-center justify-center bg-gray-50 gap-2"
        style={{ height: "calc(100vh - 72px)" }}
      >
        <div
          className="flex flex-col p-4 py-4 pb-20 m-6 mx-10 overflow-y-auto bg-white rounded-xl gap-2"
          style={{ width: `${widthCard}` }}
        >
          <div className="flex items-center justify-between">
          <div className="my-2 text-2xl text-[#FF5353] font-semibold border-b">PROFILE</div>
          <div
            className="h-0"
            style={{ left: `calc(${widthCard} - 60px)`, top: "9px" }}
          >
            {editMode ? (
              <AiOutlineClose
                onClick={(e: any) => {
                  e.preventDefault();
                  setEditMode(false);
                }}
              />
            ) : (
              <BiSolidPencil
                onClick={(e: any) => {
                  e.preventDefault();
                  setEditMode(true);
                }}
              />
            )}
          </div>
          </div>
          <div>
          {!editMode ? (
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-lg">Name: </span>
                <span className="text-gray-500">{name || " -- "}</span>
              </div>
              <div>
                <span className="text-lg">Email: </span>
                <span className="text-gray-500">{email || " -- "}</span>
              </div>
              <div>
                <span className="text-lg">Role: </span>
                <span className="text-gray-500">{role || " -- "}</span>
              </div>
              <div>
                <span className="text-lg">Address: </span>
                <span className="text-gray-500">{address || " -- "}</span>
              </div>
              <div>
                <span className="text-lg">Skills: </span>
                <span className="text-gray-500">{skills || " -- "}</span>
              </div>
              <div>
                <span className="text-lg">Phone Number: </span>
                <span className="text-gray-500">{phonenumber || " -- "}</span>
              </div>
              {!!affiliation && (
                <div>
                  <span className="text-lg">Affiliation: </span>
                  <span className="text-gray-500">
                    {affiliation || " -- "}{" "}
                  </span>
                </div>
              )}
              <div>
                <span className="text-lg">Availability: </span>
                <span className="text-gray-500">{availability || " -- "}</span>
              </div>
              <div>
                <span className="text-lg">Gender: </span>
                <span className="text-gray-500">{gender || " -- "}</span>
              </div>
              <div>
                <span className="text-lg">Resume: </span>
                <span className="text-gray-500">{resume || " -- "}</span>
              </div>
              {/* <div>
                <span className="text-lg">Hours: </span>
                <span className="text-gray-500">{hours || " -- "}</span>
              </div> */}
            </div>
          ):
          (
            <ProfileEdit
              props={{
                name,
                email,
                address,
                role,
                skills,
                phonenumber,
                affiliation,
                availability,
                gender,
                hours,
              }}
            />
          )}
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Profile;
