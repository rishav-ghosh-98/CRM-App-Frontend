import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-spinner" aria-hidden="true" />
      <span>Loading...</span>
    </div>
  );
};

export default Loader;
