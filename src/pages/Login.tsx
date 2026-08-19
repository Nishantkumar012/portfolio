import React from "react";
import { user } from "~/configs";
import type { MacActions } from "~/types";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

export default function Login(props: MacActions) {
  const [password, setPassword] = useState("");
  const [sign, setSign] = useState("Press enter to login");
  const [isloginOpen, setIsLoginOpen] = useState(false);
  const [time, setTime] = useState(moment().format("h:mm"));
  const [period, setPeriod] = useState(moment().format("A"));
  const [date, setDate] = useState(moment().format("dddd, MMMM D"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format("h:mm"));
      setPeriod(moment().format("A"));
      setDate(moment().format("dddd, MMMM D"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const keyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    if (keyCode === "Enter" || keyCode === "Space" || keyCode === "Tab")
      props.setLogin(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  return (
    <div
      className="size-full login text-center relative overflow-hidden"
      onClick={() => !isloginOpen && setIsLoginOpen(true)}
    >
      <AnimatePresence mode="wait">
        {isloginOpen ? (
          <motion.div
            key="login-panel"
            className="size-full absolute inset-0"
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            onKeyDown={keyPress}
          >
            {/* Glass Profile Card */}
            <motion.div
              style={{
                width: '300px',
                borderRadius: '28px',
                padding: '32px 24px 24px',
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '0.5px solid rgba(255,255,255,0.18)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Avatar with animated gradient ring */}
              <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '14px' }}>
                {/* Rotating gradient ring */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #007AFF, #AF52DE, #FF375F, #FF9F0A, #30D158, #007AFF)',
                    opacity: 0.85,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                />
                {/* Dark inner circle (masks the ring to show it as a border) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.9)',
                    padding: '3.5px',
                  }}
                >
                  <img
                    src={user.avatar}
                    alt="avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid rgba(255,255,255,0.08)',
                    }}
                  />
                </div>
              </div>

              {/* Name */}
              <div
                className="font-display"
                style={{
                  fontSize: '19px',
                  fontWeight: 600,
                  color: 'white',
                  letterSpacing: '0.2px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              >
                {user.name}
              </div>

              {/* Role */}
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.50)',
                  marginTop: '3px',
                  letterSpacing: '0.3px',
                }}
              >
                Full Stack Developer
              </div>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {[
                  { icon: 'i-ph:github-logo', href: 'https://github.com/Nishantkumar012', label: 'GitHub' },
                  { icon: 'i-ph:linkedin-logo', href: 'https://linkedin.com/in/nishant-kumar-534434352', label: 'LinkedIn' },
                  { icon: 'i-ph:x-logo', href: 'https://x.com/Nishant82407675', label: 'X' },
                  { icon: 'i-ph:envelope-simple', href: 'mailto:nishant64563@gmail.com', label: 'Email' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.label}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.07)',
                      border: '0.5px solid rgba(255,255,255,0.10)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span className={link.icon} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)' }} />
                  </a>
                ))}
              </div>

              {/* Divider */}
              <div
                style={{
                  width: '100%',
                  height: '0.5px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                  margin: '18px 0 14px',
                }}
              />

              {/* Sign In Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '7px 28px',
                    borderRadius: '20px',
                    border: '0.5px solid rgba(255,255,255,0.22)',
                    background: 'rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.3px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.setLogin(true);
                  }}
                  onKeyDown={keyPress}
                >
                  <span className="i-ph:arrow-elbow-down-left" style={{ fontSize: '14px', opacity: 0.8 }} />
                  Sign In
                </button>
              </motion.div>

              {/* Hint */}
              <motion.div
                style={{
                  marginTop: '10px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.40)',
                  letterSpacing: '0.2px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Press Enter to sign in
              </motion.div>
            </motion.div>

            {/* Power buttons */}
            <motion.div
              className="fixed bottom-12 inset-x-0 mx-auto flex flex-row space-x-6 w-max"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {[
                { label: 'Sleep', icon: 'i-ph:moon-stars', action: props.sleepMac },
                { label: 'Restart', icon: 'i-ph:arrow-clockwise', action: props.restartMac },
                { label: 'Shut Down', icon: 'i-ph:power', action: props.shutMac },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center cursor-pointer group"
                  style={{ width: '72px' }}
                  onClick={(e) => item.action(e)}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '0.5px solid rgba(255,255,255,0.15)',
                      transition: 'background 0.2s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
                      (e.target as HTMLElement).style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                      (e.target as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    <span className={`${item.icon} text-white text-lg`} />
                  </div>
                  <span
                    style={{
                      marginTop: '6px',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: 400,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="lock-screen"
            className="size-full flex flex-col justify-between items-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            {/* Lock screen clock */}
            <motion.div
              className="flex flex-col items-center"
              style={{ paddingTop: 'clamp(60px, 12vh, 120px)' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className="font-rounded font-tabular"
                style={{
                  fontSize: 'clamp(72px, 12vw, 110px)',
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                {time}
              </div>
              <div
                className="font-rounded"
                style={{
                  marginTop: '8px',
                  fontSize: 'clamp(16px, 2.5vw, 22px)',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 8px rgba(0,0,0,0.2)',
                }}
              >
                {date}
              </div>
            </motion.div>

            {/* Click to unlock hint */}
            <motion.div
              style={{
                paddingBottom: '48px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.5px',
                  animation: 'subtlePulse 3s ease-in-out infinite',
                  cursor: 'pointer',
                }}
              >
                Click anywhere to unlock
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
