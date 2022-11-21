export const timeStampFiled = 'timestamp';
// export const artifactNameFiled = 'case_id';
export const artifactNameFiled = 'artifact_name.keyword';

class QueryBuilder {
  query: any;
  constructor() {
    this.reset();
  }

  public build(): any {
    // Make a copy of the query
    const query = JSON.parse(JSON.stringify(this.query));
    if (query.query.bool.must.length === 0) {
      delete query.query.bool.must;
    }
    if (query.query.bool.filter.length === 0) {
      delete query.query.bool.filter;
    }
    return query.query;
  }

  public reset(): QueryBuilder {
    this.query = {
      query: {
        bool: {
          must: [],
          filter: [],
        },
      },
    };
    return this;
  }

  public addArtifactName(artifactName: string): QueryBuilder {
    const alreadyExist = this.query.query.bool.filter.find(
      (item: any) => item.term && item.term[artifactNameFiled]
    );
    if (!alreadyExist && artifactName) this.addTerm(artifactNameFiled, artifactName);
    if (!artifactName && alreadyExist) this.removeFilter(artifactNameFiled);

    return this;
  }

  public addMust(query: any): QueryBuilder {
    this.query.query.bool.must.push(query);
    return this;
  }

  public addFilter(query: any): QueryBuilder {
    this.query.query.bool.filter.push(query);
    return this;
  }

  private removeFilter(field: string): void {
    this.query.query.bool.filter = this.query.query.bool.filter.filter(
      (item: any) => item.term && item.term[field]
    );
  }

  public addRange(field: string, from: any, to: any): QueryBuilder {
    this.query.query.bool.filter.push({
      range: {
        [field]: {
          gte: from,
          lte: to,
        },
      },
    });
    return this;
  }

  public addTerm(field: string, value: any): QueryBuilder {
    this.query.query.bool.filter.push({
      term: {
        [field]: value,
      },
    });
    return this;
  }

  public addFilterTerm(field: string, value: any): QueryBuilder {
    this.query.query.bool.filter.push({
      term: {
        [field]: value,
      },
    });
    return this;
  }

  public addMatch(field: string, value: any): QueryBuilder {
    this.query.query.bool.filter.push({
      match: {
        [field]: value,
      },
    });
    return this;
  }

  public addMatchPhrase(field: string, value: any): QueryBuilder {
    this.query.query.bool.filter.push({
      match_phrase: {
        [field]: value,
      },
    });
    return this;
  }

  public addMatchPhrasePrefix(field: string, value: any): QueryBuilder {
    this.query.query.bool.filter.push({
      match_phrase_prefix: {
        [field]: value,
      },
    });
    return this;
  }

  public addQueryString(queryString: string): QueryBuilder {
    if (queryString) {
      this.query.query.bool.filter.push({
        query_string: {
          query: queryString,
        },
      });
    }
    return this;
  }

  public addExists(field: string): QueryBuilder {
    this.query.query.bool.filter.push({
      exists: {
        field,
      },
    });
    return this;
  }

  public addMissing(field: string): QueryBuilder {
    this.query.query.bool.filter.push({
      bool: {
        must_not: {
          exists: {
            field,
          },
        },
      },
    });
    return this;
  }

  public addFilters(filters: any[]): QueryBuilder {
    filters.forEach((filter: any) => {
      this.addFilter(filter.query);
    });
    return this;
  }

  public addQuery(query: any): QueryBuilder {
    if (query.query) {
      this.addMust(query.query);
    }
    return this;
  }

  public addTimeRange(timeRange: any): QueryBuilder {
    if (timeRange) {
      const { from, to } = timeRange;
      this.addRange(timeStampFiled, from, to);
    }
    return this;
  }
}

export default QueryBuilder;
