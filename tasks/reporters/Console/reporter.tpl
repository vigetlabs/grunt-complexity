✗ <%= filepath %>:<%= line %> - <%= name %> is too complicated
    Cyclomatic: <%= complexity.cyclomatic %>
    Halstead: <%= complexity.halstead.difficulty %>
      | Effort: <%= complexity.halstead.effort.toPrecision(5) %>
      | Volume: <%= complexity.halstead.volume.toPrecision(5) %>
      | Vocabulary: <%= complexity.halstead.vocabulary %>