const { format } = require("date-fns");
const client = require("../../../config/mongoose");

const { ObjectId, ISODate } = require("mongodb");
const { response } = require("express");

module.exports.defaulter = async function (req, res) {
  const database = client.db("test");
  const schoolId = new ObjectId(req.query.schoolId);

  //find all the students in the school
  const studentCollection = database.collection("students");
  const students = await studentCollection
    .find({ school_id: schoolId })
    .toArray();

  //find all the fee heads in that school
  const feeHeadsCollection = database.collection("feeheads");
  const feeHeads = await feeHeadsCollection
    .find({ school_id: schoolId })
    .toArray();

  //find all the due till date in due collection
  let dueCollection = database.collection("dues");

  let dues = [];

  students.forEach((student) => {
    feeHeads.forEach((feeHead) => {
      const currentDate = new Date();
      if (
        feeHead.class.includes(student.class) &&
        feeHead.category.includes(student.category) &&
        feeHead.gender.includes(student.gender)
      ) {
        let dueDate = new Date(feeHead.start_date);
        while (dueDate < currentDate) {
          dueDate.setMonth(dueDate.getMonth() + feeHead.frequency_months);

          const due = {
            student: student._id,
            fee_head: feeHead._id,
            due_date: dueDate.toISOString(),
          };

          dues.push(due);
        }
      }
    });
  });

  //get the payments from the payments collection

  let paymentsCollection = database.collection("payments");
  const payments = await paymentsCollection.find({}).toArray();

  //get all the pending dues by removes dues which has payments.
  const pendingDues = dues.filter((due) => {
    return !payments.some(
      (payment) =>
        JSON.stringify(due.fee_head) === JSON.stringify(payment.fee_head) &&
        JSON.stringify(due.student) === JSON.stringify(payment.student) &&
        due.due_date.slice(0, 7) ===
          JSON.stringify(payment.due_date).slice(1, 8)
    );
  });

  //find the pending fee for each student
  const studentPendingFees = {};

  pendingDues.forEach((due) => {
    const studentId = due.student;
    const feeAmount = feeHeads.find((fee) => fee._id == due.fee_head).amount;

    if (studentPendingFees.hasOwnProperty(studentId)) {
      // Student ID already exists, add feeAmount
      studentPendingFees[studentId] += feeAmount || 0;
    } else {
      // Student ID doesn't exist, create a new student ID with feeAmount
      studentPendingFees[studentId] = feeAmount || 0;
    }
  });

  res.status(200).json({
    message: "All default payments",
    studentPendingFees: studentPendingFees,
  });
};
