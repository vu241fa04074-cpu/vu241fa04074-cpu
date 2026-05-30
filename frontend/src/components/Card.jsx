function Card({ children }) {

  return (

    <div className="bg-white p-6 rounded shadow">
      {children}
    </div>
  );
}

export default Card;