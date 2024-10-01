import { Bar } from 'react-chartjs-2';

const SkillsChart = ({ skillsData }) => {
  const data = {
    labels: skillsData.map(skill => skill.name),
    datasets: [
      {
        label: 'Skill Proficiency',
        data: skillsData.map(skill => skill.proficiency), // Assuming you have proficiency data
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>Employee Skills</h3>
      <Bar data={data} />
    </div>
  );
};

export default SkillsChart;
