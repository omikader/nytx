export default function NotFoundPage() {
  return (
    <div className="uk-flex uk-flex-middle uk-position-center">
      <div>
        <span
          className="uk-margin-small-right"
          uk-icon="icon: warning; ratio: 3"
        ></span>
      </div>
      <div>
        <h1 className="uk-heading uk-margin-remove uk-padding-remove">
          Page not found
        </h1>
      </div>
    </div>
  );
}
