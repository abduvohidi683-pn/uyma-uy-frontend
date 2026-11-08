/** Maydon ostida chiqadigan xato matni. Xato bo'lmasa hech narsa chizmaydi. */
function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;

  return (
    <small
      id={id}
      role="alert"
      style={{ display: "block", marginTop: 4, color: "#dc2626", fontSize: 13 }}
    >
      {message}
    </small>
  );
}

export default FieldError;
