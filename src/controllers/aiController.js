import openai from "../config/openai.js";

export const generatePlan = async (req, res) => {
  try {
    const { eventType, guests, budget, location } = req.body;

    const prompt = `
    Plan a ${eventType} for ${guests} guests 
    with ₹${budget} budget in ${location}.
    
    Give:
    - venue suggestions
    - catering ideas
    - decoration ideas
    - timeline
    - tips
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "AI plan generate error",
    });
  }
};
