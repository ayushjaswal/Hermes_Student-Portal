import AsideNav from "@/components/AppComponents/AsideNav";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className="md:flex">
      <AsideNav />
      <section className="px-5 py-4  flex flex-col gap-2  ">
        <div className="title w-3/4">Profile</div>
        <div>
          <div className="flex gap-4">
            <div>
              <img
                src={user.avatar}
                className="w-[10rem] h-[10rem] object-cover
              "
              />
            </div>
            <div className="flex gap-4 text-center">
              <spane>Name:</spane>
              <div>
                <input
                  className="inp cursor-no-drop"
                  disabled
                  value={user.name}
                  placeholder="name"
                />
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <spane>Enrollment Number:</spane>
              <div>
                <input
                  className="inp cursor-no-drop"
                  disabled
                  value={user.enrollment}
                  placeholder="name"
                />
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <spane>Branch Id:</spane>
              <div>
                <input
                  className="inp cursor-no-drop"
                  disabled
                  value={user.banchId}
                  placeholder="branch"
                />
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <spane>DOB:</spane>
              <div>
                <input
                  className="inp cursor-no-drop"
                  disabled
                  value={user.DOB}
                  placeholder="branch"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
