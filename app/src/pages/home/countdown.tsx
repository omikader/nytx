interface IProps {
  date: string;
}

export const CountdownClock = ({ date }: IProps) => {
  return (
    <div className="uk-flex uk-flex-middle" uk-countdown={`date: ${date}`}>
      <div>
        <strong className="uk-text-small uk-text-warning">
          Next puzzle in:
        </strong>
      </div>
      <div className="uk-margin-small-left">
        <span className="uk-text-large uk-countdown-number uk-countdown-days" />
        <span className="uk-text-default uk-countdown-label">d</span>
      </div>
      <div className="uk-margin-small-left">
        <span className="uk-text-large uk-countdown-number uk-countdown-hours" />
        <span className="uk-text-default uk-countdown-label">h</span>
      </div>
      <div className="uk-margin-small-left">
        <span className="uk-text-large uk-countdown-number uk-countdown-minutes" />
        <span className="uk-text-default uk-countdown-label">m</span>
      </div>
      <div className="uk-margin-small-left">
        <span className="uk-text-large uk-countdown-number uk-countdown-seconds" />
        <span className="uk-text-default uk-countdown-label">s</span>
      </div>
    </div>
  );
};
