import ReturnLanding from "../landing-page/return-landing";

export function Friends({ setErro, setMsgErro, setSeveridade }) {
  return (
    <div>
      <ReturnLanding
        setErro={setErro}
        setMsgErro={setMsgErro}
        setSeveridade={setSeveridade}
      />
    </div>
  );
}
