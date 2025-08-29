const express = require('express');
const app = express();


app.use(express.json());

// // Constants - Replace with your actual details
const USER_INFO = {
  full_name: "nitesh_singh", // Replace with your actual name in lowercase
  birth_date: "03112003", // Replace with your actual birth date in ddmmyyyy format
  email: "nitesh.singh2022@vitstudent.ac.in", // Replace with your actual email
  roll_number: "22BLC1017" // Replace with your actual roll number
};


function isNumber(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function isAlphabet(char) {
  return /^[a-zA-Z]$/.test(char);
}

function isSpecialCharacter(char) {
  return !/^[a-zA-Z0-9]$/.test(char);
}

function processAlternatingCaps(alphabets) {
  // Extract only alphabetical characters and join them
  let allAlphabets = '';
  for (const item of alphabets) {
    for (const char of item) {
      if (isAlphabet(char)) {
        allAlphabets += char.toLowerCase();
      }
    }
  }
  
  const reversed = allAlphabets.split('').reverse().join('');
  
  let result = '';
  for (let i = 0; i < reversed.length; i++) {
    if (i % 2 === 0) {
      result += reversed[i].toUpperCase();
    } else {
      result += reversed[i].toLowerCase();
    }
  }
  
  return result;
}

function categorizeData(data) {
  const result = {
    numbers: [],
    alphabets: [],
    special_characters: []
  };
  
  for (const item of data) {
    const str = String(item);
    
    if (isNumber(str)) {
      result.numbers.push(str);
    } else if (str.length === 1 && isAlphabet(str)) {
      result.alphabets.push(str.toUpperCase());
    } else if (str.length === 1 && isSpecialCharacter(str)) {
      result.special_characters.push(str);
    } else {
      let hasAlphabet = false;
      let hasSpecial = false;
      
      for (const char of str) {
        if (isAlphabet(char)) {
          hasAlphabet = true;
        } else if (isSpecialCharacter(char)) {
          hasSpecial = true;
        }
      }
      
      if (hasAlphabet && !hasSpecial) {
        result.alphabets.push(str.toUpperCase());
      } else if (hasSpecial) {
        result.special_characters.push(str);
      }
    }
  }
  
  return result;
}

app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    
    // Validate input
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid input: 'data' must be an array"
      });
    }
    
    const categorized = categorizeData(data);
    
    const odd_numbers = [];
    const even_numbers = [];
    let sum = 0;
    
    for (const numStr of categorized.numbers) {
      const num = parseInt(numStr);
      sum += num;
      
      if (num % 2 === 0) {
        even_numbers.push(numStr);
      } else {
        odd_numbers.push(numStr);
      }
    }
    const concat_string = processAlternatingCaps(categorized.alphabets);
    
    // Build response
    const response = {
      is_success: true,
      user_id: `${USER_INFO.full_name}_${USER_INFO.birth_date}`,
      email: USER_INFO.email,
      roll_number: USER_INFO.roll_number,
      odd_numbers: odd_numbers,
      even_numbers: even_numbers,
      alphabets: categorized.alphabets,
      special_characters: categorized.special_characters,
      sum: sum.toString(),
      concat_string: concat_string
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      is_success: false,
      error: "Internal server error"
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => {
  res.status(404).json({
    is_success: false,
    error: "Route not found"
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`POST endpoint available at: http://localhost:${PORT}/bfhl`);
});

module.exports = app;
