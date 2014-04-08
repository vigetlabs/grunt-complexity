✗ <%= filepath %>:<%= line %> - <%= name %> is too complicated
    Cyclomatic: <%= cyclomatic %>
    Halstead: <%= halstead.difficulty %>
      | Effort: <%= halstead.effort.toPrecision(5) %>
      | Volume: <%= halstead.volume.toPrecision(5) %>
      | Vocabulary: <%= halstead.vocabulary %>
