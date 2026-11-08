/** Maydon ostida chiqadigan xato matni. Xato bo'lmasa hech narsa chizmaydi. */
function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;

  return (
    <small id={id} role="alert" className="mt-1 block text-[13px] text-bad">
      {message}
    </small>
  );
}

export default FieldError;
