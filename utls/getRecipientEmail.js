const getRecipientEmail = (emails,sender) => emails?.filter((email)=> email !== sender)[0]; 


export default getRecipientEmail;