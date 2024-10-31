import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ overflow: "hidden" }}>
    <div
      className="absolute w-[523px] h-[96px] left-[62px] top-[269px] font-semibold text-[40px] leading-[48px] text-black"
    >
      We understand that being a student can be{" "}
      <span style={{ color: "#FF5353" }}>challenging.</span>
    </div>

    <div
      className="absolute w-[550px] h-[72px] left-[62px] top-[383px] font-normal text-[20px] leading-[24px] text-[#666666]"
    >
      Join our dynamic team right here on campus. Earn, learn, and be part of
      the community that powers your daily essentials. Apply now and shape
      your campus experience!
    </div>

    <button
      onClick={(e) => {
        e.preventDefault();
        navigate("/register");
      }}
      type="button"
      className="absolute w-[223px] h-[54px] left-[62px] top-[501px] bg-[#FF5353] rounded-[10px] flex items-center justify-center"
    >
      <p
        className="font-semibold text-[20px] leading-[24px] text-white m-0"
      >
        Sign Up
      </p>
    </button>

    <p
      className="absolute w-[29px] h-[30px] left-[308px] top-[513px] font-poppins font-medium text-[20px] leading-[30px] text-center text-[#8C8D90]"
    >
      OR
    </p>

    <button
      onClick={(e) => {
        e.preventDefault();
        navigate("/login");
      }}
      type="button"
      className="box-border absolute w-[223px] h-[54px] left-[359px] top-[501px] bg-white border border-[#656565] rounded-[10px]"
    >
      <p
        className="font-semibold text-[20px] leading-[24px] m-0 text-[#656565]"
      >
        Login
      </p>
    </button>

    <div
      className="absolute w-[735px] h-[752px] left-[669px] top-[121px] mix-blend-multiply"
    >
      <img src="/images/landingpage_image1.png" alt="Landing Page Image" />
    </div>

    <div
      className="absolute w-[420px] h-[640px] left-[612px] top-[167px]"
    >
      <img src="/images/landingpage_image2.png" alt="Landing Page Image" />
    </div>
  </div>
  );
};

export default LandingPage;
