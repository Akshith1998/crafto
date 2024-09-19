import { ChangeEvent, useState, useRef, KeyboardEvent, FormEvent } from "react";
import Cookies from "js-cookie";
import styles from "./Login.module.scss";
import { createUser } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [userName, setUserName] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const onUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const onOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    if (!/^\d*$/.test(value)) return;

    const newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && e.currentTarget.value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName || otp.some((digit) => digit === "")) {
      setErrorMessage("Please fill in both username and OTP.");
      return;
    }

    const otpString = otp.join("");

    try {
      const response = await createUser({ userName, otp: otpString });

      if (response.token) {
        Cookies.set("token", response.token, { expires: 7 }); // Set token in cookies, valid for 7 days
        setIsSuccess(true);
        setErrorMessage(null);
      } else {
        throw new Error("Token not received");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
      setIsSuccess(false);
    }
  };

  const handleQuotes = () => {
    navigate("/quote-list");
  };

  return (
    <div className={styles.root}>
      <div className={styles.loginWrapper}>
        <h2 className={styles.loginTitle}>Login to your account</h2>
        {isSuccess ? (
          <>
            <div className={styles.successMessage}>Login successful!</div>
            <button className={styles.quotes} onClick={handleQuotes}>
              View Quotes Listing
            </button>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.nameWrapper}>
              <label className={styles.nameText}>Username</label>
              <input
                value={userName}
                placeholder="User Name"
                onChange={onUserNameChange}
                className={styles.nameInput}
              />
            </div>
            <div className={styles.otp}>
              <label className={styles.otpText}>Otp</label>
              <div className={styles.otpWrapper}>
                {otp.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => (inputs.current[index] = el)}
                    value={otp[index]}
                    onChange={(e) => onOtpChange(e, index)}
                    onKeyDown={(e) => onKeyDown(e, index)}
                    className={styles.otpInput}
                  />
                ))}
              </div>
            </div>
            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}
            <button type="submit" className={styles.submit}>
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
