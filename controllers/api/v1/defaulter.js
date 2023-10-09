const client = require("../../../config/mongoose");

module.exports.defaulter = async function (req, res) {
  const database = client.db("test");

  //filter all the paid status invoices
  const invoicesCollection = database.collection("invoices");
  const invoicesPaid = await invoicesCollection.find({
    status: "paid",
  });
  const invoicesPaidArray = await invoicesPaid.toArray();
  var paidDues = [];

  invoicesPaidArray.forEach((invoice) => {
    paidDues = [...paidDues, ...invoice.dues.map((due) => due.toString())];
  });

  //get all the due payments.
  var dueCollection = database.collection("dues");
  const duesArray = await dueCollection.find({}).toArray();

  const currentDate = new Date();
  var pendingDues = duesArray.filter((due) => {
    // Convert due_date string to a Date object
    const dueDate = new Date(due.due_date);

    // Check if the due_date is in the future (not passed) and not in paidDues
    return currentDate <= dueDate && !paidDues.includes(due._id.toString());
  });

  var studentIds = pendingDues.map((due) => due.student);

  const studentCollection = database.collection("students");

  const students = await studentCollection
    .find({ _id: { $in: studentIds } })
    .toArray();

  const populatedPendingDuesArray = pendingDues.map((due) => {
    const student = students.find((student) => student._id.equals(due.student));
    return { ...due, student };
  });

  //populate with student details
  res.status(200).json({
    message: "All default payments",
    data: {
      pendingDues: populatedPendingDuesArray,
    },
  });
};
