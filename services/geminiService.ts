import { GoogleGenAI, Type } from "@google/genai";
import { GardeningAdviceResponse, UserInput } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper to extract base64 image from response
const extractImageFromResponse = (response: any): string | undefined => {
  if (response.candidates && response.candidates.length > 0) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  return undefined;
};

export const generateGardeningAdvice = async (input: UserInput): Promise<GardeningAdviceResponse> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    Bạn là "Ban Công Xanh Sài Gòn" - trợ lý AI chuyên gia nông nghiệp đô thị tại TP.HCM, phong cách thân thiện, nhiệt tình, đậm chất miền Nam.
    
    Thông tin người dùng:
    - Diện tích: ${input.area} m²
    - Hướng nắng: ${input.sunDirection}
    - Thời gian chăm sóc: ${input.careTime}
    - Mục tiêu: ${input.goal}

    Nhiệm vụ: Tư vấn toàn diện về trồng rau ban công, bao gồm layout, cây trồng, checklist và dụng cụ mua sắm.

    DANH SÁCH LINK SHOPEE AFFILIATE BẮT BUỘC PHẢI DÙNG KHI GỢI Ý DỤNG CỤ:
    - Khay trồng rau: https://shopee.vn/search?keyword=khay+trồng+rau+thông+minh
    - Đất hữu cơ: https://shopee.vn/search?keyword=đất+sạch+hữu+cơ
    - Phân trùn quế: https://shopee.vn/search?keyword=phân+trùn+quế
    - Bình tưới: https://shopee.vn/search?keyword=bình+tưới+cây
    - Hạt giống: https://shopee.vn/search?keyword=hạt+giống+rau
    - Giàn/Kệ: https://shopee.vn/search?keyword=kệ+trồng+rau+ban+công
    - Đèn grow light (nếu thiếu nắng): https://shopee.vn/search?keyword=đèn+quang+hợp+trồng+cây

    Yêu cầu trả về JSON thuần:
    1. greeting: Lời chào thân thiện, nhận xét ngắn về điều kiện ban công của họ.
    2. plants: 3-4 loại cây phù hợp nhất (name, description, imagePrompt). 
       *Lưu ý quan trọng về imagePrompt*: Phải viết mô tả tiếng Anh chính xác về đặc điểm thực vật để tạo ảnh đúng giống.
       - Ví dụ Mồng tơi: "Malabar Spinach (Basella alba), heart-shaped thick succulent leaves, purple or green vine stems, climbing on trellis".
       - Ví dụ Cải ngọt: "Choy Sum, flowering chinese cabbage, yellow flowers, green serrated leaves".
       Luôn thêm các từ khóa: "photorealistic, macro photography, natural morning light, high resolution".
    3. layout: (description, imagePrompt). 
       *Prompt ảnh layout*: Phải mô tả khung cảnh thực tế dựa trên chính những cây và dụng cụ bạn vừa gợi ý ở trên.
       - Bắt buộc bao gồm: Diện tích ${input.area}m2, Hướng nắng ${input.sunDirection}.
       - Liệt kê cụ thể các loại cây trong mảng plants vào trong cảnh (ví dụ: "pots of Kale and Spinach").
       - Liệt kê dụng cụ (ví dụ: "vertical wooden shelf", "smart white plastic planters").
       - Mô tả bề mặt sàn và không gian: "on a weathered wooden deck" hoặc "on a minimalist concrete floor", "patterned tiles".
       - Thêm từ khóa sắp xếp: "arranged harmoniously", "neatly organized", "space-saving design".
       - Thêm yếu tố thẩm mỹ: "Golden hour lighting", "lush greenery", "cozy atmosphere", "photorealistic", "Architectural Digest style", "8k render", "highly detailed".
       - Ví dụ: "Small balcony garden ${input.area}m2, golden hour lighting, vertical shelf with pots of Malabar Spinach and Bok Choy arranged harmoniously on a weathered wooden deck, smart plastic planters with Cherry Tomatoes, cozy atmosphere, lush greenery, photorealistic 8k".
    4. checklist: 4-5 đầu việc chăm sóc cụ thể.
    5. tools: Danh sách dụng cụ cần thiết (name, reason, link). Lấy link từ danh sách trên.
    6. mistakes: 3 lỗi thường gặp và cách khắc phục (mistake, solution).
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          greeting: { type: Type.STRING },
          plants: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ["name", "description", "imagePrompt"]
            }
          },
          layout: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            },
            required: ["description", "imagePrompt"]
          },
          checklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          tools: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["name", "reason", "link"]
            }
          },
          mistakes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mistake: { type: Type.STRING },
                solution: { type: Type.STRING }
              },
              required: ["mistake", "solution"]
            }
          }
        },
        required: ["greeting", "plants", "layout", "checklist", "tools", "mistakes"]
      }
    }
  });

  if (response.text) {
    let jsonString = response.text.trim();
    // Clean markdown code blocks if present (e.g., ```json ... ```)
    if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```(json)?\s*/, "").replace(/\s*```$/, "");
    }
    return JSON.parse(jsonString) as GardeningAdviceResponse;
  }
  throw new Error("Không thể tạo nội dung tư vấn.");
};

export const generateImage = async (prompt: string): Promise<string | undefined> => {
  try {
    const modelId = "gemini-2.5-flash-image";
    // Slightly reduced additional prompts to allow the main prompt (botanical name) to take precedence
    const enhancedPrompt = `${prompt}, photorealistic, 8k, highly detailed, beautiful lighting`;
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: enhancedPrompt,
      config: {}
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Lỗi tạo ảnh:", error);
    return undefined;
  }
};