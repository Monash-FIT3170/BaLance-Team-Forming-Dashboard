import {
  Image,
  Text,
  Box,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
} from '@chakra-ui/react';

// Question sub-bodies have a strict order for elements. To forgo this, simply add new objects to the JSON without elements or a header.

export function hydrateQuestionJSON(questionJSON) {
  const questions = questionJSON.questions.map((question) => {
    const questionBodies = question.body.map((body) => {
      let table = body.table ? generateTable(body.table) : null;
      let list = body.dotpoints ? generateDotPoints(body.dotpoints) : null;
      let image = body.image ? generateImage(body.image) : null;
      let text = body.text ? generateText(body.text) : null;
      
      let qBody = (
        <Box alignItems="left">
          {text}
          {list}
          {table}
          {image}
        </Box>
      );

      return {
        header: body.header,
        bodyText: qBody
      };
    })

    return {
      title: question.title,
      b: questionBodies
    };
  })

  return questions;
}

function generateTable(tableData) {
  let header = tableData.rowHeaders;
  let rows = tableData.rowContent;

  function generateRows(rowContent) {
    return rowContent.map((content) => {
      return <Td key={content}>{content}</Td>;
    });
  }

  return (
    <TableContainer>
      <Table variant="striped">
        <Thead>
          <Tr>
            {header.map((headerValue) => {
              return <Th>{headerValue}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => {
            return <Tr>{generateRows(row)}</Tr>;
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

function generateDotPoints(listData) {
  return (
    <Box pl="10">
      <ul>
        {listData.map((text) => {
          return (
            <li key={text}>
              <Text>{text}</Text>
            </li>
          );
        })}
      </ul>
    </Box>
  );
}

function generateImage(imagePath) {
  let path = imagePath.split('/');
  let name = path[path.length - 1];
  console.log(imagePath);
  return (
    <Box>
      <Tooltip label={name}>
        <Image src={imagePath} alt={name} />
      </Tooltip>
    </Box>
  );
}

function generateText(text) {
  return (
    <Text>{text}</Text>
  )
}