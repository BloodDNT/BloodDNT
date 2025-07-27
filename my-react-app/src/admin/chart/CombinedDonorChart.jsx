import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const CombinedDonorChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend
  layout="vertical"
  verticalAlign="middle"
  align="right"
/>
      <Bar dataKey="Registered" fill="#8884d8" name="Đã đăng ký" />
      <Bar dataKey="Successful" fill="#82ca9d" name="Quyên góp thành công" />
    </BarChart>
  </ResponsiveContainer>
);

export default CombinedDonorChart;
