
const db = require("../config/db");

exports.getAcademicTree = (req, res) => {

  const query = `
  SELECT 
    b.id AS branch_id, b.branch_name,
    y.id AS year_id, y.year_name,
    s.id AS semester_id, s.semester_name,
    sub.id AS subject_id, sub.subject_name,
    u.id AS unit_id, u.unit_name,
    p.id AS pdf_id, p.title, p.download_count
  FROM branches b
  LEFT JOIN years y ON y.branch_id = b.id
  LEFT JOIN semesters s ON s.year_id = y.id
  LEFT JOIN subjects sub ON sub.semester_id = s.id
  LEFT JOIN units u ON u.subject_id = sub.id
  LEFT JOIN pdfs p ON p.unit_id = u.id
  `;

  db.query(query, (err, rows) => {

    if (err) return res.status(500).json(err);

    const branches = {};

    rows.forEach(r => {

      if (!branches[r.branch_id]) {
        branches[r.branch_id] = {
          id: r.branch_id,
          branch_name: r.branch_name,
          years: {}
        };
      }

      const branch = branches[r.branch_id];

      if (r.year_id && !branch.years[r.year_id]) {
        branch.years[r.year_id] = {
          id: r.year_id,
          year_name: r.year_name,
          semesters: {}
        };
      }

      const year = branch.years[r.year_id];
      if (!year) return;

      if (r.semester_id && !year.semesters[r.semester_id]) {
        year.semesters[r.semester_id] = {
          id: r.semester_id,
          semester_name: r.semester_name,
          subjects: {}
        };
      }

      const semester = year.semesters[r.semester_id];
      if (!semester) return;

      if (r.subject_id && !semester.subjects[r.subject_id]) {
        semester.subjects[r.subject_id] = {
          id: r.subject_id,
          subject_name: r.subject_name,
          units: {}
        };
      }

      const subject = semester.subjects[r.subject_id];
      if (!subject) return;

      if (r.unit_id && !subject.units[r.unit_id]) {
        subject.units[r.unit_id] = {
          id: r.unit_id,
          unit_name: r.unit_name,
          pdfs: []
        };
      }

      const unit = subject.units[r.unit_id];
      if (!unit) return;

      if (r.pdf_id) {
        unit.pdfs.push({
          id: r.pdf_id,
          title: r.title,
          download_count: r.download_count
        });
      }

    });

    res.json(Object.values(branches));

  });
};