export const getRooms = async () => {
  const data = await fetch(`${process.env.REACT_APP_API_URL}/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const rooms = await data.json();
  return rooms;
};
