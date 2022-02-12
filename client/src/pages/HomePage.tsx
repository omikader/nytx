import moment from "moment";

export default function HomePage() {
  const now = moment.utc();
  const day = now.day();
  const time = now.format("HH:mm");
  let countdown = now;
  if (day === 0) {
    // Su
    if (time < "23:00") {
      countdown.set({ hour: 23, minute: 0, second: 0 });
    } else {
      countdown.set({ day: 2, hour: 3, minute: 0, second: 0 });
    }
  } else if (day === 1) {
    // M
    countdown.set({ day: 2, hour: 3, minute: 0, second: 0 });
  } else if (day === 2 || day === 3 || day === 4 || day === 5) {
    // Tu, W, Th, F
    if (time < "03:00") {
      countdown.set({ hour: 3, minute: 0, second: 0 });
    } else {
      countdown.set({ day: day + 1, hour: 3, minute: 0, second: 0 });
    }
  } else if (day === 6) {
    // Sa
    if (time < "03:00") {
      countdown.set({ hour: 3, minute: 0, second: 0 });
    } else if (time < "23:00") {
      countdown.set({ hour: 23, minute: 0, second: 0 });
    } else {
      countdown.set({ day: 0, hour: 23, minute: 0, second: 0 });
    }
  }

  return (
    <div className="uk-position-center">
      <h1 className="uk-heading-medium uk-heading-divider">Next Puzzle</h1>
      <div
        className="uk-grid-small uk-child-width-auto uk-margin"
        uk-grid="true"
        uk-countdown={`date: ${countdown.format()}`}
      >
        <div>
          <div className="uk-countdown-number uk-countdown-hours" />
          <div className="uk-countdown-label uk-margin-small uk-text-center">
            Hours
          </div>
        </div>
        <div className="uk-countdown-separator">:</div>
        <div>
          <div className="uk-countdown-number uk-countdown-minutes" />
          <div className="uk-countdown-label uk-margin-small uk-text-center">
            Minutes
          </div>
        </div>
        <div className="uk-countdown-separator">:</div>
        <div>
          <div className="uk-countdown-number uk-countdown-seconds" />
          <div className="uk-countdown-label uk-margin-small uk-text-center">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}
