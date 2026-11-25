// Public configuration only. Never use a service_role or secret key.
export function createLibraryApi(client) {
  async function unwrap(request) {
    const {data,error}=await request;
    if(error) throw new Error(error.message);
    return data;
  }
  async function userId() {
    const {data,error}=await client.auth.getUser();
    if(error || !data.user) throw new Error("Sign in first");
    return data.user.id;
  }
  return {
    signIn(email,password) { return unwrap(client.auth.signInWithPassword({email,password})); },
    signOut() { return unwrap(client.auth.signOut()); },
    async ensureProfile(displayName) {
      const id=await userId();
      return unwrap(client.from("profiles").upsert({id,display_name:displayName}).select().single());
    },
    listBooks() { return unwrap(client.from("books").select("id,title,author,genre,available").order("title")); },
    async listReservations() {
      const id=await userId();
      return unwrap(client.from("reservations").select("id,book_id,status,created_at,books(title,author)").eq("user_id",id).order("created_at",{ascending:false}));
    },
    async reserve(bookId) {
      const id=await userId();
      return unwrap(client.from("reservations").insert({user_id:id,book_id:bookId,status:"reserved"}).select().single());
    },
    async cancel(reservationId) {
      const id=await userId();
      return unwrap(client.from("reservations").update({status:"cancelled"}).eq("id",reservationId).eq("user_id",id).eq("status","reserved").select().single());
    }
  };
}
