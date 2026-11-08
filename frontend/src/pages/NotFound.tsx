import StatusPage from "../components/StatusPage/StatusPage";

function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Sahifa topilmadi"
      text="Siz izlagan sahifa mavjud emas yoki ko'chirilgan."
    />
  );
}

export default NotFound;
