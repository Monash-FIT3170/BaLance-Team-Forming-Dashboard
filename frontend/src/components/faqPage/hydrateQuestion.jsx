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
  let questionList = questionJSON.questions;

  let hydratedQuestions = [];

  for (var i = 0; i < questionList.length; i++) {
    let qTitle = '';
    let qBodies = [];

    let question = questionList[i];
    let qJSONBodies = question.body;

    qTitle = question.title;

    for (var j = 0; j < qJSONBodies.length; j++) {
      let qJSONBody = qJSONBodies[j];
      let table = null;
      let list = null;
      let image = null;
      let text = qJSONBody.text;

      if (qJSONBody.hasOwnProperty('dotpoints')) {
        list = generateDotPoints(qJSONBody.dotpoints);
      }

      if (qJSONBody.hasOwnProperty('table')) {
        table = generateTable(qJSONBody.table);
      }
      if (qJSONBody.hasOwnProperty('image')) {
        image = generateImage(qJSONBody.image);
      }

      let qBody = (
        <Box alignItems="left">
          <Text>{text}</Text>
          {list}
          {table}
          {image}
        </Box>
      );
      let hydratedBody = {
        header: qJSONBody.header,
        bodyText: qBody,
      };

      qBodies.push(hydratedBody);
    }

    let hydratedQuestion = {
      title: qTitle,
      b: qBodies,
    };

    hydratedQuestions.push(hydratedQuestion);
  }

  return hydratedQuestions;
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
